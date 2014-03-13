function isAlive( request, response, serviceDescriptor )
{
    response.header( 'Content-Type', 'application/json' );
    response.header( 'X-Application-API-Version', 'v0.0.0' );

    response.write( 'true' );
    response.end( '\n' );
};

exports.isAlive = isAlive;
