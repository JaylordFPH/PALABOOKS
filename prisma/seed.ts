import { PrismaClient } from "@prisma/client";
import { faker} from "@faker-js/faker"
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

// const usedEmail = new Set<string>();
// function uniqueEmail() {
//     let email;
//     do {
//         email = faker.internet.email()
//     } while (usedEmail.has(email));
//     usedEmail.add(email)
//     return email;
// }
// const usedUsername = new Set<string>();
// function uniqueUsername() {
//     let username;
//     do {
//         username = faker.internet.username();
//     } while (usedUsername.has(username));
//     usedUsername.add(username);
//     return username
// }

function hashPassword(password: string) {
    return bcrypt.hash(password, 10);
}

async function main() {

    const user = await prisma.user.findUnique({
        where: { username: "At-rule" },
    })
    return user

}

main()
 .then( (user) => console.log(user))
 .catch(err => {
    console.log(err)
    process.exit(1)
})
 .finally(async () => await prisma.$disconnect()
)