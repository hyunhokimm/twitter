import styled from 'styled-components';
import { useState } from 'react';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import { auth, db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const TextArea = styled.textarea`
  border: 2px solid white;
  padding: 20px;
  border-radius: 20px;
  font-size: 16px;
  color: white;
  background-color: black;
  width: 100%;
  resize: none;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  &::placeholder {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI',
      Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
      sans-serif;
    font-size: 16px;
  }
  &:focus {
    outline: none;
    border-color: #1d9bf0;
  }
`;
const AttachFileButton = styled.label`
  padding: 10px 0px;
  color: #1d9bf0;
  text-align: center;
  border-radius: 20px;
  border: 1px solid #1d9bf0;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

const AttachFileInput = styled.input`
  display: none;
`;

const SubmitBtn = styled.input`
  background-color: #1d9bf0;
  padding: 10px 0px;
  border-radius: 20px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  &:hover,
  &:active {
    opacity: 0.8;
  }
`;

const Err = styled.div`
  color: red;
  margin-top: 10px;
`;

export default function PostTweetForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [tweet, setTweet] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [err, seterr] = useState('');

  const onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTweet(e.target.value);
  };

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    seterr('');
    const { files } = e.target;
    const mb = 1024 * 1024; //1mb(메가)
    const limit_size = mb * 3;

    if (files && files.length === 1) {
      if (files[0].size > limit_size) {
        seterr('3메가 이하의 파일만 가능합니다.');
      }
      setFile(files[0]);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user || isLoading || tweet == '' || tweet.length > 150) return;
    try {
      setIsLoading(true);
      const doc = await addDoc(collection(db, 'tweet'), {
        tweet,
        createAt: Date.now(),
        username: user.displayName || 'anonymous',
        userId: user.uid,
      });
      if (file) {
        const locationRef = ref(
          storage,
          `tweets/${user.uid}-${user.displayName}/${doc.id}`
        );
        const upload = await uploadBytes(locationRef, file);
        const url = await getDownloadURL(upload.ref);
        console.log(url);
        await updateDoc(doc, {
          photo: url,
        });
      }

      setTweet('');
      setFile(null);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form onSubmit={onSubmit}>
        <TextArea
          required
          onChange={onChange}
          rows={5}
          maxLength={150}
          value={tweet}
          placeholder="what is happenning?"
        />
        <AttachFileButton htmlFor="file">
          {file ? 'photo add' : 'add photo'}
        </AttachFileButton>
        <AttachFileInput
          onChange={onFile}
          type="file"
          id="file"
          accept="image/*"
        />
        <SubmitBtn
          type="submit"
          value={isLoading ? 'posting..' : 'post tweet'}
        />
      </Form>
      {err === '' ? null : <Err>{err}</Err>}
    </>
  );
}
