import React, { FC } from "react";
import ReactAudioPlayer from "react-audio-player";
import ReactPlayer from "react-player/lazy";
import { AudioPlayer } from "./AudioPlayer";

export const Services: FC = () => (
  <div className="text-center">
    <div className="mb-5">
      <h5 className="text-muted">- Music -</h5>
    </div>
    <div className="row">
      <div className="col-md-6">
        <div className="mb-5">
          <h6>Mixing</h6>
          <p>
            Working with the individual elements of your work to make them sound
            great together.
          </p>
        </div>
        <div className="mb-5">
          <h6>Mastering</h6>
          <p>
            Applying processing to the master track to standardize and bring the
            audio to industry specifications.
          </p>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-5">
          <h6>Feedback & Coaching</h6>
          <p>
            Detailed technical feedback to improve your tracks and help you
            learn along the way.
          </p>
          <p>
            Campaign specific advice regarding marketing and public relations,
            to help you make an impact with your art.
          </p>
          <p>
            Career advice for musicians and artists looking to take a step up in
            their career.
          </p>
        </div>
      </div>
    </div>

    <br />

    <div className="mb-5">
      <h5 className="text-muted">- Voice -</h5>
    </div>
    <div className="row">
      <div className="col-md-6">
        <div className="mb-5">
          <h6>Audio Processing</h6>
          <p>
            Removal of unwanted noise such as background noise, hum, plosives,
            esses, clicks, reverb and more, as well as enhancement of audio such
            as compression, equalization, balancing, stereo field,
            voice-deepening and more.
          </p>

          <table className="table table-borderless">
            <thead>
              <tr>
                <th
                  scope="col"
                  colSpan={2}
                  className="text-center small text-muted p-2"
                >
                  Example
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="p-2">
                  no fx
                </th>
                <td className="p-2">
                  <AudioPlayer src="https://zcross.s3.amazonaws.com/audio+processing+example+dry.mp3" />
                </td>
              </tr>
              <tr>
                <th scope="row" className="p-2">
                  fx
                </th>
                <td className="p-2">
                  <AudioPlayer src="https://zcross.s3.amazonaws.com/audio+processing+example+wet.mp3" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-5">
          <h6>Audio Editing</h6>
          <p>
            Removal of unwanted speech, breaths, silences and unwanted content.
            Rearranging the audio so that it flows smoothly without
            distractions.
          </p>

          <table className="table table-borderless">
            <thead>
              <tr>
                <th
                  scope="col"
                  colSpan={2}
                  className="text-center small text-muted p-2"
                >
                  Example
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th scope="row" className="p-2">
                  unedited
                </th>
                <td className="p-2">
                  <AudioPlayer src="https://zcross.s3.amazonaws.com/audio+editing+example+unedited.mp3" />
                </td>
              </tr>
              <tr>
                <th scope="row" className="p-2">
                  edited
                </th>
                <td className="p-2">
                  <AudioPlayer src="https://zcross.s3.amazonaws.com/audio+editing+example+edited.mp3" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-5">
          <h6>Content Production & Selection</h6>
          <p>
            Producing custom content such as intros, outros, ads and custom
            segments with original music and voiceover.
          </p>
          <p>
            We can also select various sections of audio to be used for such
            things as introductions, clips, bloopers, extras, etc.
          </p>
        </div>
      </div>
      <div className="col-md-6">
        <div className="mb-5">
          <h6>Audiograms & Graphics</h6>
          <p>
            Audiograms are highlight clips in video form. They are the best way
            to promote your content and go viral on social media.
          </p>
          <p>
            We can also handle visual elements that accompany audio content such
            as covers and thumbnails.
          </p>

          <table className="table table-borderless">
            <thead>
              <tr>
                <th scope="col" className="text-center small text-muted p-2">
                  Example
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-0 d-flex justify-content-center">
                  <ReactPlayer
                    url="https://zcross.s3.amazonaws.com/audiogram+example.mp4"
                    controls
                    width="75%"
                    height="75%"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mb-5">
          <h6>Sound Mixing</h6>
          <p>
            Making sure that different sounds such as music and voice are
            balanced and sit harmoniously together.
          </p>
        </div>
        <div className="mb-5">
          <h6>Scheduling & Extras</h6>
          <p>
            Handling the posting and scheduling of your audio content to hosting
            and social media sites. We can also handle auxilary tasks such as
            writing show notes, descriptions, titles, labelling chapters and
            more.
          </p>
        </div>
      </div>
    </div>
  </div>
);
