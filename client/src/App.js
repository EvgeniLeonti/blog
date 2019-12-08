import React from 'react';

import { useQuery } from '@apollo/react-hooks';
import gql from "graphql-tag";


const GET_ALL_POSTS = gql`
query {
  allPosts {
    id title timestamp summary content
  }
}
`
function App() {
  const { data, loading, error } = useQuery(GET_ALL_POSTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

  console.log(data);

  return (
    <React.Fragment>
      <h1>
        Pokémons
  
</h1>

      <p>
        <a href="https://en.wikipedia.org/wiki/List_of_Pok%C3%A9mon">The Pokémon franchise</a> revolves around 832 fictional species of collectible monsters, each having unique designs and skills. Conceived by Satoshi Tajiri in early 1989, Pokémon are creatures that inhabit the fictional Pokémon World.
        This is the list of the first 150 Pokémon as they appear in Pokémon Stadium, starting with Bulbasaur in the top left corner and ending with Mewtwo in the bottom right corner.
        
</p>
        <div className="container">
            {data && data.allPosts && data.allPosts.map((post, index) => (
                <div key={index} className="card">
                    <img src={post.image}/>
                    <div class="card-body">
                        <h2>{post.title}</h2>
                        <h3>{post.timestamp}</h3>
                        <p>
                            {post.content}
                        </p>
                    </div>
                </div>

            ))}
        </div>
    </React.Fragment>
  );
}

export default App;
