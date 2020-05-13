export const setDataTransferProp = (dt: any, event: Event) => {
    const ev = {
        dataTransfer: {
            ...dt
        }
    }
    Object.assign(event, ev);
    return event;
}