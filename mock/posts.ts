export const mockPosts = [
  {
    postId: "1",
    username: "JohnDoe",
    profilePicUrl: "https://picsum.photos/200/300",
    uploadDate: new Date("2024-07-18T10:00:00Z"),
    imageUrl: "https://picsum.photos/200/300",
    caption: "A beautiful sunset!",
    likes: 120,
    commentsCount: 3,
    allComments: [],
    mostRecentComment: {
      username: "JaneDoe",
      text: "Absolutely stunning!",
    },
  },
  {
    postId: "2",
    username: "AliceSmith",
    profilePicUrl: "https://picsum.photos/200/300",
    uploadDate: new Date("2024-05-17T14:30:00Z"),
    imageUrl: "https://picsum.photos/200/300",
    caption: "Delicious homemade pizza!",
    likes: 85,
    commentsCount: 5,
    allComments: [],
    mostRecentComment: {
      username: "BobBrown",
      text: "Looks so tasty!",
    },
  },
  {
    postId: "3",
    username: "CharlieJohnson",
    profilePicUrl: "https://picsum.photos/200/300",
    uploadDate: new Date("2024-07-16T09:20:00Z"),
    imageUrl: "https://picsum.photos/200/300",
    caption: "Hiking in the mountains",
    likes: 150,
    commentsCount: 8,
    allComments: [],
    mostRecentComment: {
      username: "DaisyMiller",
      text: "Amazing view!",
    },
  },
  {
    postId: "4",
    username: "EveWilliams",
    profilePicUrl: "https://picsum.photos/200/300",
    uploadDate: new Date("2024-07-15T18:45:00Z"),
    imageUrl: "https://picsum.photos/200/300",
    caption: "My new painting!",
    likes: 200,
    commentsCount: 10,
    allComments: [],
    mostRecentComment: {
      username: "FrankTaylor",
      text: "Incredible talent!",
    },
  },
  {
    postId: "5",
    username: "GeorgeClark",
    profilePicUrl: "https://picsum.photos/200/300",
    uploadDate: new Date("2024-07-14T11:15:00Z"),
    imageUrl: "https://picsum.photos/200/300",
    caption: "Beach day!",
    likes: 95,
    commentsCount: 4,
    allComments: [],
    mostRecentComment: {
      username: "HannahLewis",
      text: "Wish I was there!",
    },
  },
];

export default mockPosts;
