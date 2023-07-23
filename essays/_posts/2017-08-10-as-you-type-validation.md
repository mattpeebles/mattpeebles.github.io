---
layout: post
author: matt
tags: [frontend]
---
I've recently completed a project that required users to create an account in order to use the service. The account uses their email address as a username, so each user must submit a unique email upon
account creation otherwise things will get confusing. I wasn't using a front-end framework, so my solution needed to
be pure javascript/jquery.

I wanted to make the experience seamless for my user so that they didn't have to
submit the form to see if an email was taken. But in order to check my database for a duplicate email, I had to
submit an ajax call to my database each time the user typed.

So my goal was fairly straightforward. Every
time the user typed in an email, I wanted the user to receive instant feedback on whether or not the email had
already been used to create an account. 

Luckily there is a jQuery plugin, [jQuery Validator](https://jqueryvalidation.org/documentation) that will allow you to validate a form as the user types. The plugin validates according to rules you set on the form. So let's take a simple html form
that asks for an email: 

`index.html`
```html
<form id="emailForm">
    <label>Email</label>
    <input type="text" name="email" id="email" /> 
</form>;`
```

And then in your javascript file, we use jquery to hook onto the top level of the form

`app.js`
```js
function validate(){   
     $('#emailForm').validate({})
}
```

Within the validate function we can see that it takes an object. We'll be using the  [rules](https://jqueryvalidation.org/validate/#rules\) and [success](https://jqueryvalidation.org/validate/#success\) methods today. But  [normalizer](https://jqueryvalidation.org/validate/#normalizer\) is also extremely powerful as it allows you to write functions that change the value before it is validator. It is more or less like middleware for the validator itself.

Validator takes an object and where one of its keys are rules. Rules also takes an
    object where each of the keys is the <em>name</em> of the element that you'd like to validate. 

`app.js`
```js
function validate(){    
    $('#emailForm').validate({            
        rules: {                
            email: {                    
                required: true,                    
                email: true                
            }        
        }    
    })
}
```

The required key will ensure that there is a value in the input before it is submit. Likewise, email ensures that the value conforms to the standard email format. Normalizer, mentioned before, is also a key that can be placed within the named rules.

Now, our form is actively validated as the user types. However, currently, this only ensures that the user types in a email, so duplicates are still possible.

jQuery also comes with a method that allows you to call functions once a value is successfully validated. This **success** method calls the function everytime an input is validated, not once the entire form is validated. It takes label as an argument.

This allows us to query our database once the user has entered an email into the email input. We'll use an ajax call to query our database. I've quickly set up an API hook that allows us to post an email to it which it uses to query the database for that email, counts the number of matching documents and returns a message with the result. If the count is greater than 0 than we have a duplicate email and it tells us so.

For my project I've used node and express for my backend with a mongodb database.

```js
app.post('/email', (req, res) => {    
    let {email} = req.body  //the email the user has inputted    
    
    //returns a promise with the number of emails that match, that's passed to then as count   
    return Users
            .find({email})
            .count()
            .exec()     
            .then(count => {            
                const message = count > 0 ? 'Email has already been used to create an account' : 'Valid email';
                return res.json({message})       
            })
})
```

Now that we've got an api hook, we can use it within our success method in jquery validator. Success takes a label as an argument. If you `console.log(label)` you return an object. If you have a form with multiple variables, you obviously only want to make the ajax call with an email. The label object has a key called `htmlFor` that returns the name of the input that the success function is being called on. It's easy to set a conditional that checks for that to be true before posting the ajax call.

`app.js`
```js
function validate(){    
    $('#emailForm').validate({        
        rules: {            
            email: {                
                required: true,                
                email: true            
            }        
        },        
        success: function(label){            
            let data ={email: $('#email').val() } //now that we know it's a valid email we can use jquery to grab the value           
            $.ajax({                
                type: 'post',                
                url: '/email',                
                data: JSON.stringify(data),                
                contentType: 'application/json',                
                success: function(data){                        
                    if (data.message === 'Email has already been used to create an account'){                               
                        let parent = $('#email').parent()                                
                        $('#email').removeClass('valid').addClass('error')                                
                        $('#email-error').text(data.message)                        
                    }                    
                }            
            })        
        }    
    })
}
```

So within our ajax call, we've send a JSON object with the user email. Our api hook has returned a JSON object to the client side that has a message as a key. Calling data.message within the success method of the ajax call with let us read the message. If the message tells us that the email has already been taken, then we need to _overwrite_ the validator added classes on #email and #email-error. #email-error is an element that is appended to #email once it has an error class. Editing the text of the error message will inform our user of the problem.

We can also use some basic CSS to visualize the state of the input.

`main.css`
```css
input.error
{    
    border: 1px solid red;
}

input.error:focus
{    
    border:1px solid red;    
    box-shadow: 0 0 5px red;
}

input.valid
{    
    border: 1px solid green;
}

input.valid:focus
{   
    border:1px solid green;    
    box-shadow: 0 0 5px green;
}
```

Now every time the user inputs an appropriate email, they will receive instant feedback about whether it is a valid email and can adjust their input accordingly. 