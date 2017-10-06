exports.DATABASE_URL = process.env.DATABASE_URL ||
			   		   global.DATABASE_URL ||
			   		  "mongodb://mattpeebles:violet93@ds143892.mlab.com:43892/vanitypost"// "mongodb://localhost/posts"

exports.PORT = process.env.PORT || 8080;