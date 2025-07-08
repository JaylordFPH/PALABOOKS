import { PrismaClient } from "@prisma/client";
import {faker} from "@faker-js/faker"

const prisma = new PrismaClient();
// function capitalize(str: string) {
//     return str.charAt(0).toUpperCase() + str.slice(1);
// }
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
    await Promise.all(
        Array.from({length: 10000}).map(async() => {
            await prisma.user.create({
                data: {
                    username: uniqueUsername(),
                    email: uniqueEmail(),
                    password: faker.internet.password(),
                    gender: faker.person.sex() as "male" | "female",
                    dob: faker.date.birthdate()
                }
            })
        })
    );
    console.log("✅ Seeding completed.");
}

main()
 .then(() => console.log("success seeding"))
 .catch(err => {
    console.log(err)
    process.exit(1)
})
 .finally(async () => await prisma.$disconnect())