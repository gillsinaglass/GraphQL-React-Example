import React from 'react'

import { Query, Mutation } from 'react-apollo'
import { GET_USER_RECIPES, DELETE_USER_RECIPE, GET_ALL_RECIPES, GET_CURRENT_USER } from '../../queries'
import { Link } from 'react-router-dom'

class UserRecipes extends React.Component {
    handleDelete = deleteUserRecipe => {
        const confirmDelete = window.confirm('Are you sure you want to delete this recipe?')
        if (confirmDelete) {
            deleteUserRecipe().then(({ data }) => {
            })
        }
    }
    render() {
        const { username } = this.props
    return (
    <Query query={GET_USER_RECIPES} variables={{ username }}> 
        {({ data, loading, error }) => {
            if (loading) return <div>Loading</div>
            if (error) return <div>Error</div>;
            return (
            <ul className="App">
                <h3>Your Recipes</h3>
                {!data.getUserRecipes.length && <p><strong>You haven't added any Recipes yet!</strong></p>}
                {data.getUserRecipes.map(recipe => (
                    <li key={recipe._id}>
                        <Link to={  `/recipes/${recipe._id}` }>
                            <p>{recipe.name}</p>
                        </Link>
                        <p style={{marginBottom: '0'}}>Likes: {recipe.likes}</p>
                        <Mutation 
                        mutation={DELETE_USER_RECIPE} 
                        refetchQueries={() => [
                            { query: GET_ALL_RECIPES, GET_CURRENT_USER}
                        ]}
                        variables={{_id: recipe._id}}
                        update={(cache, {data: {deleteUserRecipe}}) => {
                            const { getUserRecipes } = cache.readQuery({
                                query: GET_USER_RECIPES,
                                variables: { username }
                            })
                            cache.writeQuery({
                                query: GET_USER_RECIPES,
                                variables: { username },
                                data: {
                                    getUserRecipes: getUserRecipes.filter(recipe => recipe._id !== deleteUserRecipe._id)
                                }
                            })
                            }}>
                            {(deleteUserRecipe, attrs ={}) => {
                                return (
                                    <div>
                                    <button className="button-primary">Update</button>
                                    <p 
                                    className="delete-button"
                                    onClick={() => this.handleDelete(deleteUserRecipe)}>{attrs.loading? 'deleting...' : 'X'}</p>
                                    </div>
                                    )
                            }}
                        </Mutation>
                    </li>
                ))}
            </ul>
            )
        }}

    </Query>
)}}

export default UserRecipes