import React, { useEffect } from 'react';
import UserVoteForm from './components/UserVoteForm';
import LawsuitList from './components/LawsuitList';
import { useSubstrateContext } from '@/provider/Substrate';
import UserDonationsForm from './components/UserDonationsForm';

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
      <div className="lg:flex">
        <div className="flex-1">
          <LawsuitList />
        </div>
        <div className="lg:ml-5 w-full lg:w-2/5 mt-5 lg:mt-0">
          <UserDonationsForm />
          <UserVoteForm className="mt-2" />
        </div>
      </div>
    </div>
  );
}
