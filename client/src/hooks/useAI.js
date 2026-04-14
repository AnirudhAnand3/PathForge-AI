import { useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const analyzeCareer = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post('/career/onboarding', payload);
      return data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI analysis failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const generateRoadmap = async (career) => {
    setLoading(true);
    try {
      const { data } = await api.post('/career/select-career', { career });
      return data;
    } catch (err) {
      toast.error('Roadmap generation failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSkillGap = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/career/skill-gap');
      return data;
    } catch (err) {
      toast.error('Skill gap analysis failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { loading, analyzeCareer, generateRoadmap, getSkillGap };
};