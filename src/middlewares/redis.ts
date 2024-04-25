import { NextFunction, Request, Response } from 'express';
import * as redis from 'redis';

const REDIS_URI: string = "redis://localhost:6379"

const RedisClient = redis.createClient({ url: REDIS_URI });


export const initiateClient = async () => {
    try {
        RedisClient.on('error', err => console.log('Redis Client Error', err));
        await RedisClient.connect();

        if (RedisClient.isReady) {
            console.log('Redis Client Connected');
        }
    } catch (error: any) {
        throw new Error(error)
    }

}
export const checkCache = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstname } = req.params;
        const data = await RedisClient.get(firstname);
        if (!data) {
            console.log('Data not found in cache');
            next();
        } else {
            res.status(200).json({ success: true, message: "Data found in cache", data: JSON.parse(data as string) });
        }
    } catch (error) {
        next(error);
    }
};

export const writeData = (key: string, data: string, option: redis.SetOptions) => {
    return new Promise<void>(async (resolve, reject) => {
        try {
            if (RedisClient.isOpen) {
                await RedisClient.set(key, data, option)
                resolve()
            }
            else {
                reject('Client is not connected')
            }
        } catch (error: any) {
            throw new Error(error)
        }

    })
}
export const retriveData = async (key: string) => {
    if (!RedisClient) {
        console.log('Redis Client is not initialized.')
        throw new Error('Redis Client is not initialized.');
    }

    const cachedData = await RedisClient.get(key);
    return cachedData;


}



