import { useState, useEffect } from 'react';
import categoriesJSON from '../../mockData/mainCategories.json';
import subcategoriesJSON from '../../mockData/subCategories.json';
import httpService from '../../services/http.service';
import { storageService } from '../../services';

const useMockData = () => {
  const statusConsts = {
    idle: 'Not Started',
    pending: 'In Process',
    successed: 'Ready',
    error: 'Error occurred',
  };
  const [error, setError] = useState(null);
  const [status, setStatus] = useState(statusConsts.idle);
  const [progress, setProgress] = useState(0);
  const [count, setCount] = useState(0);
  const summaryCount = categoriesJSON.length + subcategoriesJSON.length;
  const incrementCount = () => {
    setCount((prevState) => prevState + 1);
  };
  const updateProgress = () => {
    if (count !== 0 && status === statusConsts.idle) {
      setStatus(statusConsts.pending);
    }
    const newProgress = Math.floor((count / summaryCount) * 100);
    if (progress < newProgress) {
      setProgress(() => newProgress);
    }
    if (newProgress === 100) {
      setStatus(statusConsts.successed);
    }
  };

  useEffect(() => {
    updateProgress();
  }, [count]);

  async function initialize() {
    try {
      for (const category of categoriesJSON) {
        await httpService.put('constants/categories/' + category.id, category);
        incrementCount();
      }
      for (const subcategory of subcategoriesJSON) {
        await httpService.put('constants/subcategories/' + subcategory.id, subcategory);
        incrementCount();
      }
    } catch (error) {
      setError(error);
      setStatus(statusConsts.error);
    }
  }

  async function uploadSubcategoriesImages(data, subcategories) {
    try {
      const imagesResponse = await storageService.uploadSubcategoriesImages(data);
      const imagesData = await Promise.all(imagesResponse);
      for (const imageData of imagesData) {
        const currentCategory = subcategories.find((x) => x.id === imageData.name);
        await httpService.put('constants/subcategories/' + imageData.name, {
          ...currentCategory,
          image: imageData.url,
        });
      }
    } catch (error) {
      setError(error);
    }
  }
  return { error, initialize, uploadSubcategoriesImages, progress, status };
};

export default useMockData;
