import { useGlobalStore } from '@app/Aplication';
import { documentsService } from '../Documents.service';
import { useCacheDocuments } from './useCacheDocuments';
import { useGetDocument } from './useGetDocument';
import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useViewDocument = () => {
  const [searchParams] = useSearchParams();
  const { data: documentViewedId, setQueryData } =
    useGlobalStore('documentViewed');
  const { currentDocument } = useGetDocument(documentViewedId as string);
  const cacheDocuments = useCacheDocuments();
  const { mutate } = documentsService.view.useMutation({
    onSuccess() {
      cacheDocuments.invalidate();
    },
  });

  useEffect(() => {
    console.log('Cambia search Params');
    if (documentViewedId && !currentDocument?.view) {
      console.log('Lo marca como visto!', documentViewedId);
      console.log('Ejecuta servicio');
      setQueryData(null);
      setTimeout(() => {
        mutate(documentViewedId as string);
      }, 500);
    }
  }, [searchParams]);

  const markAsViewed = (id: string) => setQueryData(id);

  return { markAsViewed };
};
