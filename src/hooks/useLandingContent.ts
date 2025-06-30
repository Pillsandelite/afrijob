import { useState, useEffect } from 'react';
import { supabase, LandingContent } from '../lib/supabase';

export const useLandingContent = (section: string) => {
  const [content, setContent] = useState<LandingContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('landing_content')
          .select('*')
          .eq('section', section)
          .maybeSingle();

        if (error) {
          console.error('Error fetching content:', error);
          setError(error.message);
          // Fallback content
          setContent({
            id: 'fallback',
            section,
            heading: section === 'hero' ? 'Empowering Africa\'s Freelancers' : 'AfriWork',
            subheading: section === 'hero' ? 'Connect. Work. Earn Globally.' : 'Your trusted freelance platform',
            background_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600',
            button1_label: 'Get Started',
            button2_label: 'Sign In',
            button1_url: '/signup',
            button2_url: '/signin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          });
        } else {
          setContent(data);
          setError(null);
        }
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load content');
        // Fallback content
        setContent({
          id: 'fallback',
          section,
          heading: section === 'hero' ? 'Empowering Africa\'s Freelancers' : 'AfriWork',
          subheading: section === 'hero' ? 'Connect. Work. Earn Globally.' : 'Your trusted freelance platform',
          background_url: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1600',
          button1_label: 'Get Started',
          button2_label: 'Sign In',
          button1_url: '/signup',
          button2_url: '/signin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [section]);

  return { content, loading, error };
};