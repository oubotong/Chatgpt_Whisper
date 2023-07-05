import {

    IconCircleDotFilled,
    IconCircleDotted,
    IconHeadset,
    IconPlayerPlayFilled,

} from '@tabler/icons-react';
import React, { useRef, useState, useEffect, useContext } from 'react';
import HomeContext from '@/pages/api/home/home.context';


const mimeType = 'audio/webm';

interface Note {
    Text: string;
    Time: string;
    Duration: number;
}

type Props = {
    setAudioText: (value: string) => void;
};


const AudioRecorder: React.FC<Props> = ({ setAudioText }) => {

    const {
        state: {
            apiKey,
        }
    } = useContext(HomeContext);
    const [permission, setPermission] = useState<boolean>(false);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const [recordingStatus, setRecordingStatus] = useState<boolean>(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const [audio, setAudio] = useState<string | null>(null);
    const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
    const [audioNote, setAudioNote] = useState<Note>({ Text: '', Time: '', Duration: 0 });

    const [formData, setFormData] = useState<FormData | null>(null);
    const [isTranslating, setIsTranslating] = useState<boolean>(false);

    useEffect(() => {
        if (formData) {
            sendToTranslate();
        }
    }, [formData]);


    const getMicrophonePermission = async () => {
        if ('MediaRecorder' in window) {
            try {
                const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false
                });
                setPermission(true);
                setStream(mediaStream);
            } catch (err) {
                alert(err);
            }
        } else {
            alert('The MediaRecorder API is not supported in your browser.');
        }
    };

    const toggleRecording = async () => {
        if (!recordingStatus) {
            startRecording();
            console.log("start recording");
        } else {
            stopRecording();
            console.log("stop recording");
        }
        setRecordingStatus(!recordingStatus);
    }

    const startRecording = async () => {
        if (!stream) {
            console.error('Stream is undefined');
            return;
        }
        const media = new MediaRecorder(stream, { mimeType });

        mediaRecorder.current = media;

        mediaRecorder.current.start();

        const localAudioChunks: Blob[] = [];

        mediaRecorder.current.ondataavailable = event => {
            if (typeof event.data === 'undefined') {
                return;
            }
            if (event.data.size === 0) {
                return;
            }
            localAudioChunks.push(event.data);
        };

        mediaRecorder.current.onstop = () => {

            const audioBlob = new Blob(localAudioChunks, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);

            setAudio(audioUrl);
            setAudioChunks([]);

            const data = new FormData();
            data.append('file', audioBlob, 'audio.webm');
            setFormData(data);
            if (audioBlob.size > 25 * 1024 * 1024) {
                alert('The recorded audio is too large');
            }

            const audioElement = new Audio();
            audioElement.src = audioUrl;

            audioElement.addEventListener('loadedmetadata', () => {
                const date = new Date();
                const note: Note = {
                    Text: '',
                    Time: date.toLocaleTimeString(),
                    Duration: audioElement.duration
                };
                setAudioNote(note);
            });
        }

        setAudioChunks(localAudioChunks);
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
    };

    const sendToTranslate = async () => {
        setIsTranslating(true);

        if (!formData) {
            console.log("no form data");
            return;
        } else {
            console.log(formData);
        }

        // const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        //     headers: {
        //         Authorization: `Bearer ${apiKey}`
        //     },
        //     method: 'POST',
        //     body: formData
        // });
        const res = await fetch('api/whisper', {
            method: 'POST',
            body: formData
        });

        const data = await res.json();
        if (!data.text) {
            console.error(`Fetch operation completed, but no text was returned`);
            setIsTranslating(false);
            return;
        }
        setAudioText(data.text);
        audioNote.Text = data.text;
        console.log(`Translation: ${data.text}`);
        setIsTranslating(false);

    };

    return (
        <div>
            <div className="rounded-sm p-1 text-neutral-800 opacity-60 hover:bg-neutral-200 hover:text-neutral-900 dark:bg-opacity-50 dark:text-neutral-100 dark:hover:text-neutral-200">
                {!permission ? (
                    <button
                        onClick={getMicrophonePermission} type="button">
                        <IconHeadset size={25} />
                    </button>
                ) : null}
                {permission ? (
                    < button
                        onClick={toggleRecording} type="button">
                        {recordingStatus ? <IconCircleDotted size={25} /> : <IconPlayerPlayFilled size={25} />}
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default AudioRecorder;