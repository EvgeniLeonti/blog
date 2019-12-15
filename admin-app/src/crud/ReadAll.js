import React from "react";
import EntityTable from "../tables/EntityTable";
import {useMutation, useQuery} from "@apollo/react-hooks";
import gql from "graphql-tag";
import {useParams} from 'react-router-dom';

function ReadAll(props) {
 let {entityName} = useParams();
 let entity = props.entities.find(entity => entity.name === entityName);

 const READ_ALL_QUERY = gql`
        query {
            all${entity.pluralName} (sort: {createdAt: DESC}) {
                ${entity.fields}
            }
        }
    `;

 const DELETE_MUTATION = gql`
        mutation Delete${entity.name}($id: String!){
            delete${entity.name}(id: $id) {id}
        }
    `;

 // apollo hooks
 const {data, loading, error} = useQuery(READ_ALL_QUERY);

 const [deleteEntity, mutationResult] = useMutation(DELETE_MUTATION, {
  refetchQueries: [{query: READ_ALL_QUERY}],
 });

 // get all entities
 if (loading) return (<p>Loading entities...</p>);
 if (error) return (<p>Error getting entities: {JSON.stringify(error)}</p>);

 if (mutationResult.loading) {
  return <div>Loading...</div>
 }

 let table = <React.Fragment>
  <h1 className="h3 mb-2 text-gray-800">{entity.pluralName}</h1>
  <p className="mb-4">
   <a href={`/entity/${entity.name}/create`} className="btn btn-primary btn-icon-split">
                            <span className="icon text-white-50">
                              <i className="fas fa-plus"></i>
                            </span>
    <span className="text">Add new {entity.name}</span>
   </a>
  </p>
  <EntityTable
   data={data[`all${entity.pluralName}`]}
   entity={entity}
   deleteEntity={deleteEntity}
  />
 </React.Fragment>;

 if (mutationResult.called) {
  if (!mutationResult.error) {
   return (
    <React.Fragment>
     <div>Successfully deleted. </div>
     <hr />
     {table}
    </React.Fragment>
   )
  }
 }

 return (
  table
 );
}

export default ReadAll;