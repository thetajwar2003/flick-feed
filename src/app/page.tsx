import PostCard from "../components/PostCard";
import mockPosts from "../../mock/posts";

// api url: https://axuaofinme.execute-api.us-east-1.amazonaws.com/dev

export default function Home() {
  return (
    <main>
      <div className="w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 ">
          {mockPosts.map((post) => (
            <PostCard key={post.postId} {...post} />
          ))}
        </div>
      </div>
    </main>
  );
}