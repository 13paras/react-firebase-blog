const reactionEmoji = {
  thumbsUp: "👍🏻",
  wow: "😲",
  heart: "💖",
  rocket: "🚀",
  coffee: "☕",
};

const ReactionButtons = ({ post }) => {
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type='button'
        className='space-x-3 border-none bg-transparent'
        // onClick={() =>
        //   dispatch(reactionAdded({ postId: post.id, reaction: name }))
        // }
      >
        <span className='mx-1 flex items-center rounded-full text-3xl transition-all duration-200 ease-in-out active:scale-95'>
          {emoji}
          <span className='text-base font-semibold text-zinc-100'> 1 </span>
        </span>
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};

export default ReactionButtons;
