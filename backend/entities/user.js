import typeorm from 'typeorm';

const User = new typeorm.EntitySchema({
  name: 'User',
  columns: {
    id: {
      primary: true,
      type: Number,
      generated: true,
    },
    email: {
      type: String,
      unique: true,
    },
    firstname: { type: String },
    lastname: { type: String },
    liked_movies :{
      type : "simple-array",
    },
    disliked_movies :{
      type : "simple-array",
    },
    adult :{
      type: Boolean
    }
  },
});

export default User;
