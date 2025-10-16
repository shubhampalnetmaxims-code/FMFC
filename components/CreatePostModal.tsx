import React, { useState } from 'react';
import Icon from './Icon';

interface CreatePostModalProps {
    onClose: () => void;
    onAddPost: (postData: { description: string, hashtags: string[], image: string }) => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ onClose, onAddPost }) => {
    const [description, setDescription] = useState('');
    const [hashtags, setHashtags] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string;
                setImage(result);
                setImagePreview(result);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!description || !image) {
            alert('Please add a description and an image.');
            return;
        }
        onAddPost({
            description,
            hashtags: hashtags.split(' ').filter(Boolean).map(tag => tag.startsWith('#') ? tag : `#${tag}`),
            image,
        });
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col">
                 <header className="flex items-center justify-between p-4 border-b border-zinc-800">
                    <h2 className="text-lg font-bold">Create Post</h2>
                    <button onClick={onClose} className="text-zinc-400 hover:text-white">
                        &times;
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto p-4 space-y-4">
                    <div>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="What's on your mind?"
                            className="w-full h-32 bg-zinc-800 border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                     <div>
                        <input
                            type="text"
                            value={hashtags}
                            onChange={(e) => setHashtags(e.target.value)}
                            placeholder="#hashtags #go #here"
                            className="w-full bg-zinc-800 border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="image-upload" className="block text-sm font-medium text-zinc-400 mb-2">Add a photo</label>
                        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-zinc-700 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="mx-auto h-32 w-auto rounded-md object-cover" />
                                ) : (
                                    <Icon type="photo" className="mx-auto h-12 w-12 text-zinc-500"/>
                                )}
                                <div className="flex text-sm text-zinc-500">
                                    <label htmlFor="image-upload" className="relative cursor-pointer bg-zinc-800 rounded-md font-medium text-amber-400 hover:text-amber-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                                        <span>Upload a file</span>
                                        <input id="image-upload" name="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-zinc-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        </div>
                    </div>
                </form>
                
                <footer className="p-4 border-t border-zinc-800">
                    <button 
                        type="submit" 
                        onClick={handleSubmit}
                        className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors duration-200 disabled:bg-zinc-600"
                        disabled={!description || !image}
                    >
                        Post
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default CreatePostModal;