
import React, { useState } from 'react';
import type { Post, Comment as CommentType, User } from '../types';
import { COMMUNITIES_DATA } from '../constants';
import Icon from './Icon';
import { useToast } from './ToastProvider';

interface PostCardProps {
    post: Post;
    currentUser: User;
    showCommunityName?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({ post, currentUser, showCommunityName }) => {
    const { addToast } = useToast();
    // State for likes
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(post.likes);

    // State for comments
    const [comments, setComments] = useState<CommentType[]>(post.comments);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');

    const EMOJIS = ['😊', '❤️', '😂', '👍', '🔥', '🎉'];

    const handleLikeToggle = () => {
        setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
        setIsLiked(!isLiked);
    };

    const handleCommentSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() === '') return;

        const newCommentObject: CommentType = {
            user: currentUser,
            text: newComment,
        };

        setComments([...comments, newCommentObject]);
        setNewComment('');
    };

    const handleShare = async () => {
        const shareUrl = `https://social.fitness/post/${post.id}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `Post by ${post.user.name} on HHC`,
                    text: `Check out this post: ${post.description}`,
                    // FIX: Replaced window.location.href with a simulated permalink to prevent "Invalid URL" errors.
                    url: shareUrl,
                });
            } catch (error) {
                console.error('Error sharing post:', error);
                // As a fallback for some edge cases where share might fail, copy to clipboard
                await navigator.clipboard.writeText(shareUrl);
                addToast('Sharing failed. Link copied to clipboard!', 'warning');
            }
        } else {
            // Fallback for browsers that don't support the Web Share API
            try {
                await navigator.clipboard.writeText(shareUrl);
                addToast('Post link copied to clipboard!', 'info');
            } catch (err) {
                console.error('Failed to copy: ', err);
                addToast('Could not copy link to clipboard.', 'error');
            }
        }
    };

    const addEmoji = (emoji: string) => {
        setNewComment(newComment + emoji);
    };

    const getChannelName = () => {
        const community = COMMUNITIES_DATA.find(c => c.id === post.communityId);
        const channel = community?.channels.find(ch => ch.id === post.channelId);
        return channel?.name || 'Unknown Channel';
    };

    const getCommunityName = () => {
        const community = COMMUNITIES_DATA.find(c => c.id === post.communityId);
        return community?.name || 'Unknown Community';
    };

    return (
        <div className="bg-zinc-900 rounded-lg overflow-hidden mb-4">
            {/* Post Header */}
            <div className="p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <img src={post.user.avatar} alt={post.user.name} className="w-10 h-10 rounded-full object-cover" />
                    <div className="ml-3">
                        <span className="font-semibold text-zinc-100">{post.user.name}</span>
                        {showCommunityName && (
                            <p className="text-xs text-zinc-400">
                                in <span className="font-medium text-zinc-300">{getCommunityName()}</span>
                            </p>
                        )}
                    </div>
                </div>
                <div className="text-xs font-semibold bg-amber-400/10 text-amber-300 px-2 py-1 rounded-full">
                    #{getChannelName()}
                </div>
            </div>

            {/* Post Media */}
            {post.image && <img src={post.image} alt="Post content" className="w-full h-auto" />}
            {post.video && (
                <video src={post.video} controls className="w-full h-auto bg-black">
                    Your browser does not support the video tag.
                </video>
            )}

            {/* Post Actions */}
            <div className="p-4 flex items-center space-x-6">
                <button
                    onClick={handleLikeToggle}
                    className={`flex items-center space-x-2 transition-colors ${
                        isLiked ? 'text-red-500' : 'text-zinc-400 hover:text-red-500'
                    }`}
                    aria-pressed={isLiked}
                >
                    <Icon type={isLiked ? 'like-filled' : 'like'} />
                    <span className="text-sm font-medium">{likeCount.toLocaleString()}</span>
                </button>
                <button
                    onClick={() => setShowComments(!showComments)}
                    className="flex items-center space-x-2 text-zinc-400 hover:text-amber-400 transition-colors"
                    aria-expanded={showComments}
                >
                    <Icon type="comment" />
                    <span className="text-sm font-medium">{comments.length.toLocaleString()}</span>
                </button>
                <button
                    onClick={handleShare}
                    className="flex items-center space-x-2 text-zinc-400 hover:text-amber-400 transition-colors ml-auto"
                >
                    <Icon type="share" />
                </button>
            </div>

            {/* Post Description */}
            <div className="px-4 pb-4">
                <p className="text-zinc-300 text-sm mb-2 whitespace-pre-wrap">{post.description}</p>
                <div className="flex flex-wrap gap-x-2">
                    {post.hashtags.map((tag, index) => (
                        <span key={index} className="text-amber-400 text-sm font-semibold cursor-pointer hover:underline">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Comments Section */}
            {showComments && (
                <div className="px-4 pb-4 border-t border-zinc-800 pt-4">
                    <div className="space-y-3 max-h-48 overflow-y-auto mb-4 pr-2">
                        {comments.length > 0 ? comments.map((comment, index) => (
                            <div key={index} className="flex items-start space-x-2">
                                <img src={comment.user.avatar} alt={comment.user.name} className="w-6 h-6 rounded-full object-cover mt-1" />
                                <div>
                                    <span className="font-semibold text-sm text-zinc-200">{comment.user.name}</span>
                                    <p className="text-sm text-zinc-400 break-words">{comment.text}</p>
                                </div>
                            </div>
                        )) : (
                            <p className="text-sm text-zinc-500">Be the first to comment.</p>
                        )}
                    </div>
                    
                    <div className="flex space-x-2 mb-2">
                        {EMOJIS.map(emoji => (
                            <button key={emoji} onClick={() => addEmoji(emoji)} className="text-xl hover:scale-125 transition-transform">{emoji}</button>
                        ))}
                    </div>

                    <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2">
                        <img src={currentUser.avatar} alt="Your avatar" className="w-8 h-8 rounded-full object-cover" />
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add a comment..."
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-full px-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                        <button type="submit" className="text-amber-400 hover:text-amber-300 disabled:text-zinc-600 transition-colors" disabled={!newComment.trim()}>
                            <Icon type="send" className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PostCard;