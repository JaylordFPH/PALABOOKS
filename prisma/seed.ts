import { PrismaClient } from "@prisma/client";
import {faker} from "@faker-js/faker"

const prisma = new PrismaClient();

const usedEmail = new Set<string>();
    const usedUsername = new Set<string>();
    function uniqueEmail() {
        let email;
        do {
            email = faker.internet.email()
        } while (usedEmail.has(email));
        usedEmail.add(email)
        return email;
    }

    function uniqueUsername() {
        let username;
        do {
            username = faker.internet.username();
        } while (usedUsername.has(username));
        usedUsername.add(username);
        return username
    }

async function main() {
    // await Promise.all(
    //     Array.from({length: 10000}).map(async() => {
    //         await prisma.user.create({
    //             data: {
    //                 firstname: faker.person.firstName(),
    //                 middlename: faker.person.middleName(),
    //                 lastname: faker.person.lastName(),
    //                 username: uniqueUsername(),
    //                 email: uniqueEmail(),
    //                 password: faker.internet.password(),
    //                 gender: faker.person.sex() as "male" | "female",
    //                 dob: faker.date.birthdate(),
    //                 author: {
    //                     create: {
    //                     }
    //                 }
    //             },
                
    //         })
    //     })
    // );
    const cursorId = 
    const limit = 10
    const firstQuery = await prisma.user.findMany({
        where: {
            gender: "male"
        },
        ...(cursorId && {skip: 1}),
        take: limit,
        cursor: {
            id: cursorId
        },
        select: {
            username: true
        },
        orderBy: {
            username: "asc"
        }
    })

}

main()
 .then( (data) => console.log(data))
 .catch(err => {
    console.log(err)
    process.exit(1)
})
 .finally(async () => await prisma.$disconnect())