import express from 'express'
import {Request, Response, NextFunction} from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port:string = process.env.PORT || '8082';
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );

  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  app.get("/filteredimage", async (req:Request, res:Response, next:NextFunction) => {
    try{
      let imageDir:string = await filterImageFromURL(req.query.image_url)
      res.status(200).sendFile(imageDir)
      // Deletes the file from the file system after .5 seconds
      setTimeout(()=>deleteLocalFiles([imageDir]), 500)
    }catch(err){
      return next(err)
    }
  })


  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();
