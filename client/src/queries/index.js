import { gql } from 'apollo-boost'
// eslint-disable-next-line
export const GET_ALL_RECIPES = gql 
`
query {
    getAllRecipes{
        name
        description
        instructions
        category
        likes
        createdDate
    }
}`