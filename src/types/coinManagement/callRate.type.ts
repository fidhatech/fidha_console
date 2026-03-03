export type CallRateType = {
    audioCallRate: number,
    videoCallRate: number,
};

export type CallRateDataType = {
    id: string,
    title: string,
    type: string,
    subtitle: {
        audio: string,
        video: string,
    },
    coinsPerMinute: {
        audioCallRate: number,
        videoCallRate: number
    },
    policy: string,
};

export type CallRateCommissionType = {
    id: string | number,
    type: string,
    audioCallRate: number,
    videoCallRate: number
}