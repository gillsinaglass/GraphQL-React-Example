const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
require('dotenv').config({path: 'variables.env'});
const Recipe = require("./Models/Recipe");
const User = require("./Models/User");
const path = require('path')

// Bring in GraphQL Middleware
const { graphiqlExpress, graphqlExpress} = require('apollo-server-express')
const {makeExecutableSchema} = require('graphql-tools')

const { typeDefs } = require ('./schema');
const { resolvers } = require(`./resolvers`);

// Create GraphQL Schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});

// Connects to Database
mongoose.connect(process.env.MONGO_URI, {autoIndex: false})
    // .then(()=> console.log('DB Connected'))
    // .catch(err=> console.error(err));

// Initializes Application
const app = express();

const corsOptions = {
    // // string of url that we are making requests from
    // origin: 'http://localhost:3000',
    // // needed for apollo-client to work correctly. 
    // credentials: true
}
app.use(cors('*'))

// Set up JWT authentication middleWare
app.use(async (req, res, next) => {
    const token = req.headers['authorization'];
    if (token !== "null") {
        try {
            const currentUser = await jwt.verify(token, process.env.SECRET);
            req.currentUser = currentUser
        } catch (err) {
            console.error(err)
        }
    }
    // console.log(token)
    next();
});

// Creates Graphiql application
// app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql'}
// ))

// Connect Schemas with GraphQL
app.use('/graphql', 
bodyParser.json(), 
graphqlExpress(({ currentUser }) => ({
    schema,
    context: {
        Recipe,
        User,
        // currentUser being passed here
        currentUser
    }
}))
);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}

const PORT = process.env.PORT || 4444

app.listen(PORT, () => {
    // console.log(`Server Listening on PORT${PORT}`);
})