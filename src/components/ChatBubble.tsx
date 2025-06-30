import { motion } from 'framer-motion';

interface ChatBubbleProps {
  message: string;
  userType: 'user' | 'farm-assist';
}

export default function ChatBubble({ message, userType }: ChatBubbleProps) {
  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const isFarmAssist = userType === 'farm-assist';

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={messageVariants}
      className={`flex ${isFarmAssist ? 'justify-start' : 'justify-end'}`}
    >
      <div className="relative w-full"> {/* Added w-full */}
        {/* Main bubble */}
        <div 
          className={`
            relative p-4 rounded-2xl
            max-w-[400px] mb-4
            ${isFarmAssist 
              ? 'bg-white text-gray-800 shadow-md ml-0 mr-auto' 
              : 'bg-green-600 text-white ml-auto mr-0'
            }
          `}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {message}
          </p>
        </div>

        {/* Pointy arrow */}
        <div 
          className={`
            absolute bottom-0 w-0 h-0
            border-solid
            ${isFarmAssist
              ? 'left-6 border-t-[20px] border-l-[20px] border-b-[20px] border-t-transparent border-b-transparent border-l-white'
              : 'right-6 border-t-[20px] border-r-[20px] border-b-[20px] border-t-transparent border-b-transparent border-r-green-600'
            }
          `}
        />
      </div>
    </motion.div>
  );
}
