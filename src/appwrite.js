import { Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;
const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(PROJECT_ID);


const database = new Databases(client);

export const updateSearchCount = async (searchTerm,movie ) =>{
//1.use appwrite sdk to check if the search term already exists in the database
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID,[Query.equal('searchTerm', searchTerm)]);
    if(result.documents.length>0){
        const doc = result.documents[0];
        //2. If it exists, update the count
        await database.updateDocument(
          DATABASE_ID,
          COLLECTION_ID,
          doc.$id,
          {
            count: doc.count + 1,
          }
        );
    }
    else{
        //3. If it does not exist, create a new document with count 1
        await database.createDocument(
          DATABASE_ID,
          COLLECTION_ID,
          ID.unique(),
          {
            searchTerm: searchTerm,
            count: 1,
            movie_id: movie.id,
            poster_url:`https://image.tmdb.org/t/p/w500/${movie.poster_path}`,
          }
        );
    }
  } catch (error) {
    console.error(error);
  }
}

export const getTrendingMovies = async () => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.orderDesc('count'),
            Query.limit(5)
        ]);
    
        return result.documents;
    } catch (error) {
        console.error(error);
    }

}