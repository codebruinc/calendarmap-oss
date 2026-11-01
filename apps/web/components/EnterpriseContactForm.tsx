'use client';

import { useState } from 'react';

interface EnterpriseContactFormProps {
  source?: string;
}

export default function EnterpriseContactForm({ source = 'unknown' }: EnterpriseContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Track form submission attempt
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible('Enterprise Form Submit', {
          props: {
            source: source
          }
        });
      }

      const response = await fetch('/api/contact/enterprise', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          source
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }

      setSubmitted(true);

      // Track successful submission
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible('Enterprise Form Success', {
          props: {
            source: source,
            isGoal: true
          }
        });
      }
    } catch (err) {
      setError('Failed to submit. Please try again or email us directly at support@codebru.com');
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
        <div className="text-green-600 text-4xl mb-4">✓</div>
        <h3 className="text-xl font-semibold text-green-900 mb-2">
          Thanks! We'll be in touch soon.
        </h3>
        <p className="text-green-700">
          We typically respond within 1 business day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-2xl font-semibold mb-2 text-gray-900">Talk to us</h3>
      <p className="text-gray-600 mb-6 text-sm">
        We'll help you automate your calendar workflows.
      </p>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Work Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            How do you use calendars today?
          </label>
          <textarea
            id="description"
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Tell us about your calendar workflow..."
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>

      <p className="text-xs text-gray-500 mt-4 text-center">
        We respect your privacy and never share your information.
      </p>
    </form>
  );
}
