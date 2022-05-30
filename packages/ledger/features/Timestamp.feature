Feature: Timestamp

  Scenario Outline: Generating timestamps
    Given an count of <count> timestamps with a min delay of <min> and max delay of <max>
    When when generating a list of timestamps
    Then it should create timestamps without conflicts

    Examples: 
      | count | min | max |
      |   100 |   0 |  50 |
