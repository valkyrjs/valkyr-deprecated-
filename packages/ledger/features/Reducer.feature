Feature: Reducer

  Scenario: Reducing a series of events
    Given a list of events
    When the events are reduced
    Then the state should return a reduced result
