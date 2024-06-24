import { LocalDatabase } from "./api.js"

const dbStructure = [
    {
        'Boxs': [
            {
                primaryKey: '_id',
                indexes: [
                    { _id: { unique: true } }
                ]
            }
        ]
    },
    // {
    //     'users': [
    //         {
    //             primaryKey: '_id',
    //             indexes: []
    //         }
    //     ]
    // },
    // {
    //     'products': [
    //         {
    //             primaryKey: '_id',
    //             indexes: []
    //         }
    //     ]
    // }
]
const database = new LocalDatabase('TimeTrackingDashboard', dbStructure,  1)

export const initBoxs = async () => {
    return await database.getAllData('Boxs')
}
export const addBox = async (newBoxs) => {
    // delete newBoxs._id
    await database.addData('Boxs', newBoxs)
}

export const getBox = async (id) => {
    return await database.getData('Boxs', id)
}

export const updateBox = async (newBoxs) => {
    await database.updateData('Boxs', newBoxs)
}
export const deleteBox = async (id) => {
    await database.deleteData('Boxs', id)
}