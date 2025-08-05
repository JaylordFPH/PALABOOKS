import { PrismaClient } from "@prisma/client";
import { faker} from "@faker-js/faker"
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

const usedEmail = new Set<string>();
function uniqueEmail() {
    let email;
    do {
        email = faker.internet.email()
    } while (usedEmail.has(email));
    usedEmail.add(email)
    return email;
}
const usedUsername = new Set<string>();
function uniqueUsername() {
    let username;
    do {
        username = faker.internet.username();
    } while (usedUsername.has(username));
    usedUsername.add(username);
    return username
}

function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

async function main() {
    await Promise.all(
        Array.from({length: 100}).map(async() => {
            await prisma.user.create({
                data: {
                    firstname: faker.person.firstName(),
                    middlename: faker.person.middleName(),
                    lastname: faker.person.lastName(),
                    username: uniqueUsername(),
                    email: uniqueEmail(),
                    password: await hashPassword(faker.internet.password()),
                    gender: faker.person.sex() as "male" | "female",
                    dob: faker.date.birthdate(),
                    author: {
                        create: {
                        }
                    }
                },      
            })
        })
    );


    // await prisma.user.create({
    //     data: {
    //         firstname: "Jaylord",
    //         middlename: "Pinos",
    //         lastname: "Soguilon",
    //         username: "JaylordPogi",
    //         email: "JaySoguilonIS@gmail.com",
    //         password: "Jaylord123",
    //         gender: "male" as "male" | "female",
    //         dob: new Date("2003-08-04"),
    //         author: {
    //             create: {
    //             }
    //         }   
    //     }
    // })
    // console.log("Done seeding...")
}

main()
 .then( () => console.log("Success"))
 .catch(err => {
    console.log(err)
    process.exit(1)
})
 .finally(async () => await prisma.$disconnect()
)