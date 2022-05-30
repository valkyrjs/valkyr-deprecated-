Feature: Projection

  Scenario Outline: Projecting an event
    Given a projection that is registered under the "<method>" handler
    When the projected the event is hydrated <hydrated> and outdated <outdated>
    Then the projection outcome should be <outcome>

    Examples: 
      | method | hydrated | outdated | outcome |
      | once   | false    | false    | true    |
      | once   | true     | false    | false   |
      | once   | false    | true     | false   |
      | once   | true     | true     | false   |
      | on     | false    | false    | true    |
      | on     | true     | false    | true    |
      | on     | false    | true     | false   |
      | on     | true     | true     | false   |
      | all    | false    | false    | true    |
      | all    | true     | false    | true    |
      | all    | false    | true     | true    |
      | all    | true     | true     | true    |
