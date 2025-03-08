import { useEffect, useState } from 'react';

function PasswordStrengthIndicator({ password }) {
  const [strength, setStrength] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    calculateStrength(password);
  }, [password]);

  const calculateStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (!password) {
      setStrength(0);
      setMessage('');
      return;
    }

    // Length check
    if (password.length >= 8) {
      score += 25;
    } else {
      feedback.push('At least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 25;
    } else {
      feedback.push('At least one uppercase letter');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 25;
    } else {
      feedback.push('At least one lowercase letter');
    }

    // Number check
    if (/\d/.test(password)) {
      score += 12.5;
    } else {
      feedback.push('At least one number');
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 12.5;
    } else {
      feedback.push('At least one special character');
    }

    setStrength(score);
    setMessage(feedback.join(', '));
  };

  const getStrengthColor = () => {
    if (strength >= 100) return 'bg-green-500';
    if (strength >= 80) return 'bg-blue-500';
    if (strength >= 60) return 'bg-yellow-500';
    if (strength >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="mt-2">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full ${getStrengthColor()} transition-all duration-300`}
          style={{ width: `${strength}%` }}
        />
      </div>
      {message && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Required: {message}
        </p>
      )}
    </div>
  );
}

export default PasswordStrengthIndicator; 