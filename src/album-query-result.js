import Album from './album';
import AlbumQueryResultBase from './album-query-result-base';
import changeObserverHandler from './change-observer-handler';
import NativeApi from './index';

export default class AlbumQueryResult extends AlbumQueryResultBase {
    constructor(obj, fetchParams, eventEmitter) {
        super();
        this.eventEmitter = eventEmitter;
        this._fetchParams = fetchParams || {};
        Object.assign(this, obj);
        this._albumNativeObjs = this.albums;
        this.albums = this
            ._albumNativeObjs
            .map(albumObj => new Album(albumObj, this._fetchParams.assetFetchOptions, eventEmitter));
        eventEmitter.addListener('onObjectChange', (changeDetails) => {
            if (this._cacheKey === changeDetails._cacheKey) {
                this.emit('onChange', changeDetails, this);
            }
        });
    }

    stopTracking() {
        return NativeApi.stopTracking(this._cacheKey);
    }

    applyChangeDetails(changeDetails) {
        this.albums = changeObserverHandler(changeDetails, this.albums, (nativeObj) => {
            return new Album(nativeObj, this._fetchParams.fetchOptions, this.eventEmitter);
        });
        return this.albums;
    }
}
