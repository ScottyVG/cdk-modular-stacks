// Simple Lambda function for demonstration
// In a real project, this would contain your actual business logic

const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    console.log('Event:', JSON.stringify(event, null, 2));
    
    const { httpMethod, path, pathParameters } = event;
    const tableName = process.env.TABLE_NAME;
    
    try {
        switch (httpMethod) {
            case 'GET':
                if (pathParameters && pathParameters.id) {
                    // Get single item
                    const result = await dynamodb.get({
                        TableName: tableName,
                        Key: { pk: pathParameters.id }
                    }).promise();
                    
                    return {
                        statusCode: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify(result.Item || {})
                    };
                } else {
                    // List all items
                    const result = await dynamodb.scan({
                        TableName: tableName
                    }).promise();
                    
                    return {
                        statusCode: 200,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify(result.Items || [])
                    };
                }
                
            case 'POST':
                const item = JSON.parse(event.body);
                item.pk = item.id || Date.now().toString();
                
                await dynamodb.put({
                    TableName: tableName,
                    Item: item
                }).promise();
                
                return {
                    statusCode: 201,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(item)
                };
                
            case 'PUT':
                if (!pathParameters || !pathParameters.id) {
                    return {
                        statusCode: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify({ error: 'ID is required' })
                    };
                }
                
                const updateItem = JSON.parse(event.body);
                updateItem.pk = pathParameters.id;
                
                await dynamodb.put({
                    TableName: tableName,
                    Item: updateItem
                }).promise();
                
                return {
                    statusCode: 200,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify(updateItem)
                };
                
            case 'DELETE':
                if (!pathParameters || !pathParameters.id) {
                    return {
                        statusCode: 400,
                        headers: {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        body: JSON.stringify({ error: 'ID is required' })
                    };
                }
                
                await dynamodb.delete({
                    TableName: tableName,
                    Key: { pk: pathParameters.id }
                }).promise();
                
                return {
                    statusCode: 204,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                };
                
            default:
                return {
                    statusCode: 405,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ error: 'Method not allowed' })
                };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
};