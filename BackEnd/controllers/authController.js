const db = require("../models");
const config = require("../config/authConfig");
const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const signup = async (req, res) => {
    // Save user to db
    try {
        const user = await User.create({
            userID: req.body.userID,
            username: req.body.username,
            email: req.body.email,
            gender: req.body.gender,
            password: bcrypt.hashSync(req.body.password, 8),
            birthdate: req.body.birthdate
        });

        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles,
                    },
                },
            });

            const result = user.setRoles(roles);
            if (result) res.send({ message: "User registered successfully!" });
        } else {
            //  User has role = 1
            const result = user.setRoles([1]);
            if (result) res.send({ message: "User registered successfully!" });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
}

const signin = async (req, res) => {
    try {
        // Check username
        const user = await User.findOne({
            where: {
                username: req.body.username
            },
        });

        if (!user) {
            return res.status(404).send({ message: "User Not Found!" });
        }

        // Check password
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                message: "Invalid Password!"
            });
        }

        const token = jwt.sign({ id: user.id },
            config.secret,
            {
                algorithm: 'HS256',
                allowInsecureKeySizes: true,
                expiresIn: 86400 //24 hours
            }
        );


        let authorities = [];
        const roles = await user.getRoles();
        for (let i = 0; i < roles.length; i++) {
            authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }

        req.session.token = token;

        return res.status(200).send({
            userID: user.userID,
            username: user.username,
            email: user.email,
            roles: authorities,
        });

    } catch (error) {
        return res.status(500).send({message: error.message});
    }
}

const signout = async(req,res) => {
    try{
        req.session = null;
        return res.status(200).send({
            message: "You've been signed out!!"
        });
    }catch(error){
        this.next(error);
    }
}


module.exports = {
    signup,
    signin,
    signout
  }