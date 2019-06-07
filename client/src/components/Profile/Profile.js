import React from 'react';
import UserInfo from "./UserInfo"
import UserRecipes from "./UserRecipes"

const Profile = ({ session }) => (
    <div>
        <UserInfo session={ session }/>
        <UserRecipes username={ session.getCurrentUser.username }/>
    </div>
);

export default Profile