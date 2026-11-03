import { db } from "./db.mjs";
import { QueryCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { createError } from "@middy/util";

// "type" och "name" är reserverade ord i DynamoDB och måste skrivas som #type och #name i expressions

// GET all Athletes
export const getAthletes = async () => {

    const command = new QueryCommand({
            TableName : 'athlete-db',
            KeyConditionExpression : '#type = :type',
            ExpressionAttributeNames : {
                '#type' : 'type'
            },
            ExpressionAttributeValues : {
                ':type' : 'athlete'
            }
        });

    try {
        const { Items } = await db.send(command);
        return Items;

    } catch(error) {
        console.error('ERROR:', error)
        throw createError(500, 'Could not fetch athletes')
    }
}

// GET one Athlete
export const getAthleteById = async (id) => {

    const command = new GetCommand({
            TableName : 'athlete-db',
            Key : {
                type : 'athlete',
                id : id
            }
        });

    try {
        const { Item } = await db.send(command);
        return Item;

    } catch(error) {
        console.error('ERROR:', error)
        throw createError(500, 'Could not fetch athlete')
    }
}


// POST new Athletes
export const addAthlete = async (athlete) => {

    const command = new PutCommand({
            TableName : 'athlete-db',
            Item : athlete
        });

    try {
        await db.send(command);
        return athlete;

    } catch(error) {
        console.error('ERROR:', error)
        throw createError(500, 'Could not add athlete')
    }
}


// update whole Athlete
export const updateAthlete = async (id, { name, sport, autograph }) => {

    const command = new UpdateCommand({
            TableName : 'athlete-db',
            Key : {
                type : 'athlete',
                id : id
            },
            UpdateExpression : 'SET #name = :name, sport = :sport, autograph = :autograph',
            // Utan villkoret skapar UpdateCommand en ny post om id:t inte finns
            ConditionExpression : 'attribute_exists(id)',
            ExpressionAttributeNames : {
                '#name' : 'name'
            },
            ExpressionAttributeValues : {
                ':name' : name,
                ':sport' : sport,
                ':autograph' : autograph
            },
            ReturnValues : 'ALL_NEW'
        });

    try {
        const { Attributes } = await db.send(command);
        return Attributes;

    } catch(error) {
        if (error.name === 'ConditionalCheckFailedException') {
            throw createError(404, 'Athlete not found')
        }
        console.error('ERROR:', error)
        throw createError(500, 'Could not update athlete')
    }
}


// update Athlete autograph
export const updateAthleteAutograph = async (id, autograph) => {
    const command = new UpdateCommand({
        TableName : 'athlete-db',
        Key : {
            type : 'athlete',
            id : id
        },
        UpdateExpression : 'SET autograph = :autograph',
        ExpressionAttributeValues : {
            ':autograph' : autograph
        },
        ReturnValues : 'ALL_NEW'
    });

    try {
        const { Attributes } = await db.send(command);
        return Attributes;
    } catch(error) {
        console.error('ERROR:', error);
        throw createError(500, 'Could not update athlete');
    }
}

// delete Athlete
export const deleteAthlete = async (id) => {

    const command = new DeleteCommand({
            TableName : 'athlete-db',
            Key : {
                type : 'athlete',
                id : id
            },
            ReturnValues : 'ALL_OLD'
        });

    try {
        const { Attributes } = await db.send(command);
        return Attributes;

    } catch(error) {
        console.error('ERROR:', error)
        throw createError(500, 'Could not delete athlete')
    }
}
