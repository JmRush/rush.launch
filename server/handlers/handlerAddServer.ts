

export const handlerAddServer = async (req: Request, res: Response) => {
    //make sure auth on dockerhub is working

    //POST to https://hub.docker.com/v2/auth/token with {identifer, secret} as the body

    //Parse the response of the POST request to get the short lived JWT token

    //GET TO https://hub.docker.com/v2/namespaces/{namespace}/repositories/{repository} 

    //pull image data from dockerhub using the dockerhub credentials and a provided image_url or other method

    //store image data in the database as a server type


}