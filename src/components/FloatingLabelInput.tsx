import { useState, InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';

interface FloatingLabelInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export function FloatingLabelInput({
    label,
    error,
    className = '',
    ...props
}: FloatingLabelInputProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [hasValue, setHasValue] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHasValue(e.target.value.length > 0);
        props.onChange?.(e);
    };

    const isFloating = isFocused || hasValue;

    return (
        <div className="relative">
            <input
                {...props}
                onChange={handleChange}
                onFocus={(e) => {
                    setIsFocused(true);
                    props.onFocus?.(e);
                }}
                onBlur={(e) => {
                    setIsFocused(false);
                    props.onBlur?.(e);
                }}
                className={`
          w-full px-4 pt-6 pb-2 
          glass rounded-lg
          text-white placeholder-transparent
          border ${error ? 'border-red-500/50' : 'border-white/10'}
          focus:border-primary focus:outline-none
          transition-all duration-200
          ${className}
        `}
                placeholder={label}
            />

            <motion.label
                initial={false}
                animate={{
                    top: isFloating ? '0.5rem' : '50%',
                    fontSize: isFloating ? '0.75rem' : '1rem',
                    translateY: isFloating ? '0%' : '-50%',
                }}
                transition={{ duration: 0.2 }}
                className={`
          absolute left-4 pointer-events-none
          ${isFloating ? 'text-primary' : 'text-gray-400'}
          transition-colors duration-200
        `}
            >
                {label}
            </motion.label>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-1 ml-1"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}
