module.exports = (sequelize, DataTypes) => {
    const Question = sequelize.define("question", {
        questionID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
        },
        examID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: {
                field: 'examID',
                references: {
                    model: 'Exam',
                    key: 'examID'
                }
            }

        },
        questionText: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        option1: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        option2: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        option3: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        option4: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        attach: {
            type: DataTypes.BLOB,
            allowNull: true,
        }

    }, {
        timestamps: false,
    });

    return Question;
};