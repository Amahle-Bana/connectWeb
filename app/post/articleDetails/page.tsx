"use client"

import ArticleAudio from "@/components/PostPage/MobileArticleAudio";
import ArticleCategory from "@/components/PostPage/MobileArticleCategory";
import ArticleDescription from "@/components/PostPage/MobileArticleDescription";
import ArticleHeading from "@/components/PostPage/MobileArticleHeading";
import ArticleImage from "@/components/PostPage/MobileArticleImage";
import ArticleSubcategory from "@/components/PostPage/MobileArticleSubcategory";
import { useState } from "react";
import { useRouter } from "next/navigation";
import SettingsModal from '@/components/PostPage/MobileSettingsModal';



export default function ArticleDetails() {

    const router = useRouter();
    const [heading, setHeading] = useState("");
    const [isHeadingCopied, setIsHeadingCopied] = useState(false);
    const [description, setDescription] = useState("");
    const [isDescriptionCopied, setIsDescriptionCopied] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [categorySearch, setCategorySearch] = useState("");
    const [allCategories, setAllCategories] = useState([
        "Family", "Health", "Relationships", "Sexuality", "Home", "Food", "Pets", "Mental Health", "Productivity", "Mindfulness", "Business", "Marketing", "Leadership", "Work", "Artificial Intelligence",
        "Blockchain", "Data Science", "Gadgets", "Makers", "Security", "Technology", "Design", "Project Management", "Programming", "Dev Ops", "Operating Systems", "Writing", "Art", "Gaming", "Humor",
        "Movies", "Music", "News", "Photography", "Podcasts", "Television", "Economics", "Education", "Equality", "Finance", "Law", "Transportation", "Politics", "Race", "Science", "Mathematics", "Drugs",
        "Philosophy", "Religion", "Spirituality", "Cultural Studies", "Fashion", "Beauty", "Language", "Sports", "Cities", "Nature", "Travel"
    ]);
    const [categoryInputFocused, setCategoryInputFocused] = useState(false);
    const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
    const [subcategorySearch, setSubcategorySearch] = useState("");
    const [subcategoryInputFocused, setSubcategoryInputFocused] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);
    const [audioPreview, setAudioPreview] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioDuration, setAudioDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);

    // Category to Subcategories mapping (from page.tsx)
    const categoryToSubcategories: Record<string, string[]> = {
        "Family": ["Adoption", "Children", "Elder Care", "Fatherhood", "Motherhood", "Parenting", "Pregnancy", "Seniors"],
        "Health": ["Aging", "Coronavirus", "Covid-19", "Death And Dying", "Disease", "Fitness", "Healthcare", "Mental Health", "Nutrition", "Sleep", "Trans Healthcare", "Vaccines", "Weight Loss", "Womens Health"],
        "Relationships": ["Dating", "Divorce", "Friendship", "Love", "Marriage", "Polymary"],
        "Sexuality": ["BDSM", "Erotica", "Kink", "Sex", "Sexual Health"],
        "Home": ["Architecture", "Home Improvement", "Homeownership", "Interior Design", "Rental Property", "Vacation Rental"],
        "Food": ["Cooking", "Desserts", "Drinks", "Gluten-Free", "Healthy", "Meat", "Pasta", "Pizza", "Salad", "Sandwiches", "Seafood", "Sides", "Soups", "Vegan", "Vegetarian"],
        "Pets": ["Cats", "Dogs", "Fish", "Horses", "Other Pets", "Reptiles", "Small Pets", "Wildlife"],
        "Mental Health": ["Anxiety", "Couseling", "Grief", "Life Lessons", "Self-Awareness", "Bipolar", "Depression", "Eating Disorders", "Grief", "LGBTQ+", "Mental Health", "PTSD", "Self-Help", "Stress", "Suicide", "Trauma"],
        "Productivity": ["Career Advice", "Coaching", "Goal Setting", "Morning Routines", "Pomodoro Technique", "Time Management", "To-Do Lists", "Workflow", "Time Management", "Work Life Balance"],
        "Mindfulness": ["Mediation", "Journaling", "Mediation", "Transcendental Mediation", "Yoga"],
        "Business": ["Business", "Freelancing", "Small Business", "Startups", "Venture Capital"],
        "Marketing": ["Advertising", "Branding", "Content Marketing", "Content Strategy", "Digital Marketing", "SEO", "Social Media", "Storytelling For Business"],
        "Leadership": ["Employee Engagement", "Leadership Development", "Management", "Meetings", "Org Charts", "Thought Leadership"],
        "Work": ["Company Retreats", "Digital Nomads", "Distributed Teams", "Future Of Work", "Work From Home", "Remote Work"],
        "Artificial Intelligence": ["ChatGPT", "Conversational AI", "Deep Learning", "Large Language Models", "Machine Learning", "NLP", "Voice Assistants"],
        "Blockchain": ["Bitcoin", "Decentralized Finance", "Cryptocurrency", "Ethereum", "NFTs", "Smart Contracts", "Web3"],
        "Data Science": ["Data Analysis", "Data Visualization", "Data Engineering", "Data Mining", "Data Modeling", "Database Design", "Tools", "Libraries", "Frameworks", "Projects", "Tutorials", "SQL"],
        "Gadgets": ["eBook", "Internet Of Things", "Tablets", "Smart Home", "Smartphones", "Wearables", "Laptops", "Computers", "VR Glasses", "AR Glasses", "TVs"],
        "Makers": ["3D Printing", "Arduino", "DIY", "Raspberry Pi", "Robotics"],
        "Security": ["Cybersecurity", "Data Security", "Encryption", "Infosec", "Passwords", "Privacy"],
        "Technology": ["Amazon", "Apple", "Google", "Mastodon", "Medium", "Meta", "Microsoft", "Tiktok", "Twitter"],
        "Design": ["Accessibility", "Designs Systems", "Design Thinking", "Graphic Design", "Icon Design", "Inclusive Design", "Product Design", "Typography", "UX Design", "UI Design"],
        "Project Management": ["Agile", "Kanban", "Scrum", "Waterfall", "Innovation", "Kanban", "Lean Startup", "MVP", "Product", "Strategy", "Project Planning", "Project Execution", "Project Monitoring", "Project Evaluation", "Project Closure"],
        "Programming": ["Android Development", "Coding", "Flutter", "Frontend Engineering", "iOS Development", "Mobile Development", "Software Engineering", "Web Development", "Angular", "CSS", "HTML", "JavaScript", "Python", "React", "React Native", "Ruby", "Rust", "Swift", "TypeScript", "Vue", "Webpack", "WordPress", "Xamarin", "Yarn", "Zapier"],
        "Dev Ops": ["AWS", "Databricks", "Docker", "Kubernetes", "Terraform"],
        "Operating Systems": ["Android", "iOS", "Linux", "MacOS", "Windows"],
        "Writing": ["30 Day Challenge", "Book Reviews", "Books", "Creative Nonfiction", "Diary", "Fiction", "Haiku", "Hello World", "Memior", "Nonfiction", "Personal Essay", "Poetry", "Screenwriting", "Short Stories", "This Happened", "Writing Prompts", "Writing Tips"],
        "Art": ["Comics", "Contemporary Art", "Drawing", "Fine Art", "Graphic Design", "Illustration", "Painting", "Photography", "Sculpture", "Typography", "Generative Art", "Illustration", "Painting", "Portraits", "Street Art"],
        "Game Design": ["Game Design", "Game Development", "Indie Game", "Metaverse", "Nintendo", "Playstation", "Videogames", "Virtual Reality", "Xbox"],
        "Philosophy": ["Atheism", "Epistemology", "Ethics", "Existentialism", "Feminism", "Freud", "Gandhi", "Hegel", "Hume", "Kant", "Marx", "Nietzsche", "Plato", "Postmodernism", "Psychoanalysis", "Religion", "Socrates", "Stoicism", "Wittgenstein"],
        "Religion": ["Buddhism", "Christianity", "Hinduism", "Islam", "Judaism", "Latter-Day Saints", "Mormonism", "Orthodox Christianity", "Protestantism", "Sikhism", "Spirituality", "Zoroastrianism"],
        "Spirituality": ["Astrology", "Energy Healing", "Horoscopes", "Mysticism", "New Age", "Occult", "Parapsychology", "Psychology", "Reiki", "Tarot", "Voodoo"],
        "Cultural Studies": ["Ancient History", "Anthropology", "Cultural Heritage", "Digital Life", "History", "Museums", "Sociology", "Tradition"],
        "Fashion": ["Accessories", "Clothing", "Design", "Jewelry", "Shoes", "Style", "Trends", "Luxury Fashion"],
        "Language": ["Chinese", "English", "French", "German", "Italian", "Japanese", "Korean", "Portuguese", "Russian", "Spanish", "Turkish", "Vietnamese", "Arabic", "Hebrew", "Hindi", "Indonesian", "Malay", "Thai", "Turkish", "Urdu", "Dutch", "Polish", "Portuguese", "Romanian", "Serbian", "Slovak", "Slovenian", "Swedish", "Thai", "Turkish", "Ukrainian", "Vietnamese", "Arabic", "Hebrew", "Hindi", "Indonesian", "Malay", "Thai", "Turkish", "Urdu", "Dutch", "Polish", "Portuguese", "Romanian", "Serbian", "Slovak", "Slovenian", "Swedish", "Thai", "Turkish", "Ukrainian", "Vietnamese", "Arabic", "Hebrew", "Hindi", "Indonesian", "Malay", "Thai", "Turkish", "Urdu", "Dutch"],
        "Sports": ["Football(soccer)", "Gridiron Football", "Hockey", "Rugby", "Tennis", "Basketball", "Baseball", "Cricket", "Golf", "Soccer", "Volleyball", "Water Polo", "Wrestling", "Boxing", "MMA", "Mixed Martial Arts", "Wrestling", "Boxing", "MMA"],
        "Cities": ["Amsterdam", "Athens", "Berlin", "Buenos Aires", "Cairo", "Cape Town", "Dubai", "Edinburgh", "Florence", "Geneva", "Hong Kong", "Istanbul", "Jerusalem", "Kuala Lumpur", "Lisbon", "London", "Los Angeles", "Madrid", "Melbourne", "Mexico City", "Milan", "Montreal", "Moscow", "Munich", "New York", "Oslo", "Paris", "Prague", "Rome", "San Francisco", "Sao Paulo", "Seoul", "Shanghai", "Singapore", "Stockholm", "Sydney", "Tokyo", "Toronto", "Vienna", "Warsaw", "Wellington", "Zurich"],
        "Beauty": ["Beauty", "Tips", "Products", "News", "Reviews", "Tutorials", "How-To", "Tips", "Products", "Trends", "News", "Reviews", "Tutorials", "How-To"],
        "Nature": ["Birding", "Camping", "Climate Change", "Conservation", "Ecology", "Environment", "Extinction", "Global Warming", "Green Living", "Pollution", "Recycling", "Sustainability", "Wildlife", "Hiking"],
        "Travel": ["Tourism", "Travel Tips", "Travel Writing", "Vacation", "Vanlife"]
    };

    // Compute available subcategories based on selected categories
    const availableSubcategories = selectedCategories
        .flatMap((cat) => categoryToSubcategories[cat] || [])
        .filter((sub, idx, arr) => arr.indexOf(sub) === idx); // unique

    const filteredSubcategories = availableSubcategories.filter(
        (sub) =>
            sub.toLowerCase().includes(subcategorySearch.toLowerCase()) &&
            !selectedSubcategories.includes(sub)
    );

    // Filtered Categories
    const filteredCategories = allCategories.filter(
        (cat) =>
            cat.toLowerCase().includes(categorySearch.toLowerCase()) &&
            !selectedCategories.includes(cat)
    );


    return (
        <div>
            <div className="flex-1 space-y-4 p-3">

                {/* Article Heading Input */}
                <ArticleHeading
                    heading={heading}
                    setHeading={setHeading}
                    isHeadingCopied={isHeadingCopied}
                    setIsHeadingCopied={setIsHeadingCopied}
                />

                {/* Article Description Input */}
                <ArticleDescription
                    description={description}
                    setDescription={setDescription}
                    isDescriptionCopied={isDescriptionCopied}
                    setIsDescriptionCopied={setIsDescriptionCopied}
                />

                {/* Article Category Input */}
                <ArticleCategory
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    categorySearch={categorySearch}
                    setCategorySearch={setCategorySearch}
                    categoryInputFocused={categoryInputFocused}
                    setCategoryInputFocused={setCategoryInputFocused}
                    filteredCategories={filteredCategories}
                    allCategories={allCategories}
                />

                {/* Subcategories Input */}
                <ArticleSubcategory
                    selectedSubcategories={selectedSubcategories}
                    setSelectedSubcategories={setSelectedSubcategories}
                    subcategorySearch={subcategorySearch}
                    setSubcategorySearch={setSubcategorySearch}
                    subcategoryInputFocused={subcategoryInputFocused}
                    setSubcategoryInputFocused={setSubcategoryInputFocused}
                    filteredSubcategories={filteredSubcategories}
                    selectedCategories={selectedCategories}
                />
            </div>

            {/* Right side - Image Upload */}
            <div className="w-full p-3 pb-20">
                <ArticleImage
                    imagePreview={imagePreview}
                    setImagePreview={setImagePreview}
                />

                <ArticleAudio
                    audioFile={audioFile}
                    setAudioFile={setAudioFile}
                    audioPreview={audioPreview}
                    setAudioPreview={setAudioPreview}
                    audioDuration={audioDuration}
                    setAudioDuration={setAudioDuration}
                    currentTime={currentTime}
                    setCurrentTime={setCurrentTime}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                />
            </div>

            {/* Bottom Fixed Tab Bar */}
            <div className="fixed bottom-0 left-0 right-0 p-1 h-16 border-t border-gray-300 flex justify-between items-center bg-background z-50">

                <div>
                    <button
                        className="px-3 py-2 rounded-md bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 font-playfair-display ml-2"
                        onClick={() => router.back()}
                    >
                        Back
                    </button>
                </div>
                <div>
                <button
                        className="px-3 py-2 mr-2 rounded-md border text-gray-800 text-sm hover:bg-gray-300 font-playfair-display ml-2"
                        onClick={() => setSettingsModalOpen(true)}
                    >
                        Settings
                    </button>
                <button
                    className="px-3 py-2 rounded-md bg-blue-500 text-white text-sm hover:bg-blue-600 font-playfair-display mr-2"
                    onClick={() => router.push('/home')}
                >
                    Continue
                </button>
                </div>
            </div>

            <SettingsModal
                open={settingsModalOpen}
                onOpenChange={setSettingsModalOpen}
            />
        </div>
    );

}