import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { User, Mail, Phone, Camera, Save, Upload } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [name, setName] = useState(user?.name || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    if (!user) {
        return (
            <div className="min-h-screen bg-dark-bg flex items-center justify-center text-white">
                Please log in to view your profile.
            </div>
        );
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Resize image to avoid throwing LocalStorage Quota Exceeded
            const reader = new FileReader();
            reader.onloadend = () => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_WIDTH = 150;
                    const MAX_HEIGHT = 150;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    setAvatar(resizedDataUrl);
                };
                img.src = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 500));

            updateUser({ name, avatar });
            toast.success('Profile updated successfully');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-dark-bg">
            <Navbar />
            <main className="pt-24 pb-16">
                <div className="max-w-2xl mx-auto px-4 sm:px-6">
                    <h1 className="text-3xl font-bold text-white mb-8">My Profile</h1>

                    <div className="bg-dark-50 rounded-2xl border border-white/5 p-8">
                        <form onSubmit={handleSave} className="space-y-6">
                            {/* Avatar Section */}
                            <div className="flex flex-col items-center mb-8">
                                <div className="relative w-32 h-32 mb-4 group">
                                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-purple-500/20 bg-dark-100">
                                        {avatar ? (
                                            <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-500">
                                                {name.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer"
                                    >
                                        <Camera className="w-8 h-8 text-white" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 p-2 bg-purple-500 rounded-full text-white hover:bg-purple-600 transition-colors z-10"
                                    >
                                        <Upload className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                                <p className="text-gray-400 text-sm">Click to upload new picture</p>
                            </div>

                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label className="text-gray-400">Full Name</Label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <Input
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="pl-10 bg-white/5 border-white/10 text-white focus:border-purple-500"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-400">Email Address</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <Input
                                            value={user.email}
                                            disabled
                                            className="pl-10 bg-white/5 border-white/10 text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-red-400/70 ml-1">Email cannot be changed</p>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-gray-400">Phone Number</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                        <Input
                                            value={user.phone}
                                            disabled
                                            className="pl-10 bg-white/5 border-white/10 text-gray-400 cursor-not-allowed"
                                        />
                                    </div>
                                    <p className="text-xs text-red-400/70 ml-1">Phone number cannot be changed</p>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold py-6"
                                >
                                    {isLoading ? 'Saving...' : 'Save Changes'}
                                    {!isLoading && <Save className="ml-2 w-5 h-5" />}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
