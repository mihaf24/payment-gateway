const express= require('express');
const keys= require('./config/keys');
const stripe= require('stripe')(keys.stripeSecretKey);

const bodyParser= require('body-parser');
const exphbs= require('express-handlebars');

const app= express();


//handlebars middlewar
app.engine('handlebars',exphbs({defaultLayout:'main'}));
app.set('view engine','handlebars');

//bodyparser middlewar
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));


//set the static folder
app.use(express.static(`${__dirname}/public`));

//index route
app.get('/',(req,res)=>{
   res.render('index',{
        stripePublishableKey: keys.stripePublishableKey
   }); 
}); 

app.get('/success',(req,res)=>{
    res.render('success');
})

app.post('/charge',(req,res)=>{
    
     console.log(req.body);
    //  res.send('done');
    amount= req.body.donate * 100;
    stripe.customers.create({
        email: req.body.stripeEmail,
        source: req.body.stripeToken

    }).then(customer=> stripe.charges.create({
        amount:amount,
        description: 'jk rowling book',
        currency: 'usd',
        customer: customer.id
    })).then(charge=> res.render('success',{
        amount: req.body.donate
    } ))
    .catch((e)=>{
        console.log(e);
    })

})

const port= process.env.PORT || 5000;

app.listen(port,()=>{
    console.log('server started');
})