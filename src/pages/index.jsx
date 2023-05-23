import React, { useEffect } from 'react';
import UserVoteForm from './components/UserVoteForm';
import LawsuitList from './components/LawsuitList';
import { useSubstrateContext } from '@/provider/Substrate';

export default function index() {
  const { state, dispatch } = useSubstrateContext();
  useEffect(() => {
    dispatch({
      type: 'CONNECT',
      payload: {
        ws: 'ws://localhost:8844',
        dispatch,
      },
    });
  }, []);

  useEffect(() => {
    if (state.isConnected && state.api) {
    }
  }, [state.isConnected, state.api]);
  return (
    <div className="container mx-auto py-5 m:px-5">
      <div className="md:flex">
        <div className="flex-1">
          <LawsuitList />
        </div>
        <div className="md:ml-5 w-2/5 m:w-full m:mt-5">
          <UserVoteForm />
        </div>
      </div>
    </div>
  );
}
