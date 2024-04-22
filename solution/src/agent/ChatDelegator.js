import createCommentSubAgent from "./subagents/CreateCommentSubAgent";
import createLoginSubAgent from "./subagents/LoginSubAgent";

const createChatDelegator = () => {

    let delegate;
    let delegateName;

    /**
     * DELEGATE_MAP maps a string to its corresponding subagent. The subagent
     * is expected to be a closure taking an `end` callback function as a parameter and
     * returning `async` functions `handleInitialize`  and `handleReceive`. 
     * It is initialized upon `beginDelegation` and dereferenced upon calling `end`.
     */
    const DELEGATE_MAP = {
        "LOGIN": createLoginSubAgent,
        "CREATE": createCommentSubAgent
    }

    /**
     * beginDelegation will set `delegate` and `delegateName` to be the
     * given `candidate` and begin delegation by calling initialized
     * delegates `handleInitialize` function
     * @param {string} candidate required, must be a string defined within `DELEGATE_MAP`
     * @param {*} data optional, passes through to delegate's `handleInitialize`
     * @returns A message, message object, list of messages, or list of message objects from the subagent.
     */
    const beginDelegation = async (candidate, data = undefined) => {
        if (Object.keys(DELEGATE_MAP).includes(candidate)) {
            const initiator = DELEGATE_MAP[candidate]
            if (typeof(initiator) === 'function') {
                delegateName = candidate;
                delegate = initiator(endDelegation);
                if (typeof(delegate.handleInitialize) === 'function') {
                    return await delegate.handleInitialize(data);
                } else {
                    console.warn(`Delegate '${candidate}' has no handleInitialize function! Did you define it?`)
                }
            } else {
                console.log(`Cannot create delegate '${candidate}' as it is not defined as a function in DELEGATE_MAP. Did you accidentally use a function call rather than a function callback?`)
            }
        } else {
            if (DELEGATE_MAP) {
                console.error(`Attempting to create delegate '${candidate}', but no delegates exist! Have you defined your DELEGATE_MAP?`)
            } else {
                console.error(`Attempting to create delegate '${candidate}', but no such delegate exists! Valid delegates include ${Object.keys(DELEGATE_MAP).join(",")}`)
            }
        }
    }

    /**
     * handleDelegation takes a given `prompt` and passes it along to the current
     * delegate's `handleReceive` function. If a delegate has not been set (e.g.
     * `beginDelegation` has not been called), an error will occur.
     * @param {string} prompt 
     * @returns A message, message object, list of messages, or list of message objects from the subagent.
     */
    const handleDelegation = async (prompt) => {
        if (delegate) {
            if (typeof(delegate.handleReceive) === 'function') {
                return await delegate.handleReceive(prompt);
            } else {
                console.error(`Attempted to handle delegation for the prompt '${prompt}'. While the '${delegateName}' delegate was found, it does not have a handleReceive function. Did you define it?`);
            }
        } else {
            console.error(`Attempted to handle delegation for the prompt '${prompt}', but no delegate has been set! Did you beginDelegation?`);
        }
    }

    /**
     * endDelegation ends the current delegation. It is passed to the given subagent
     * in `beginDelegation` to be called when delegation should be ended.
     * @param {*} data optional, to be passed back. Useful for clear, shorthand returns.
     * @returns data, if given.
     */
    const endDelegation = (data) => {
        if (!delegate) {
            console.warn("Attempting to end delegation, but no delegate has been set! Ignoring...");
        }
        delegate = undefined;
        delegateName = undefined;
        return data;
    }

    /**
     * getDelegate returns the `delegate` if it exists
     * @returns `delegate`, if it exists
     */
    const getDelegate = () => {
        if (!delegate) {
            console.warn("Attempting to get delegate, but no delegate has been set!");
        }
        return delegate;
    }

    /**
     * getDelegateName returns the `delegateName` if it exists
     * @returns `delegateName`, if it exists
     */
    const getDelegateName = () => {
        if (!delegateName) {
            console.warn("Attempting to get delegateName, but no delegateName has been set!");
        }
        return delegateName;
    }

    /**
     * hasDelegate returns whether or not the delegator is currently
     * delegating to its subagents
     * @returns true if delegating, false otherwise
     */
    const hasDelegate = () => {
        return delegate ? true : false;
    }

    return {
        beginDelegation,
        handleDelegation,
        endDelegation,
        getDelegate,
        getDelegateName,
        hasDelegate
    }
}

export default createChatDelegator;