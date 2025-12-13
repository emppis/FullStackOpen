import deepFreeze from 'deep-freeze'
import { describe, expect, test } from 'vitest'
import reducer, { createAnecdote, vote } from './anecdoteReducer'

describe('anecdote reducer', () => {
    test('NEW_ANECDOTE adds a new anecdote', () => {
        const state = []
        deepFreeze(state)

        const action = createAnecdote('Test anecdote')
        const newState = reducer(state, action)

        expect(newState).toHaveLength(1)
        expect(newState[0].content).toBe('Test anecdote')
        expect(newState[0].votes).toBe(0)
        expect(newState[0].id).toBeDefined()
    })
    test('VOTE increments votes of the right anecdote', () => {
        const initialState = [
            { id: '1', content: 'First anecdote', votes: 0 },
            { id: '2', content: 'Second anecdote', votes: 0 }
        ]
        deepFreeze(initialState)

        const action = vote('1')
        const newState = reducer(initialState, action)

        expect(newState).toHaveLength(2)
        expect(newState.find(a => a.id === '1').votes).toBe(1)
        expect(newState.find(a => a.id === '2').votes).toBe(0)
    })
    test('anecdotes votes update correctly', () => {
        const initialState = [
            { id: '1', content: 'First', votes: 0 },
            { id: '2', content: 'Second', votes: 5 },
            { id: '3', content: 'Third', votes: 2 }
        ]
        deepFreeze(initialState)

        const action = vote('1')
        const newState = reducer(initialState, action)

        expect(newState.find(a => a.id === '1').votes).toBe(1)
        expect(newState.find(a => a.id === '2').votes).toBe(5)
        expect(newState.find(a => a.id === '3').votes).toBe(2)

        const sorted = [...newState].sort((a, b) => b.votes - a.votes)
        const votesArray = sorted.map(a => a.votes)
        expect(votesArray).toEqual([5, 2, 1])
    })
})