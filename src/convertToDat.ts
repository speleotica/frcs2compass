import {
  FrcsSurveyFile,
  FrcsTrip,
  FrcsTripSummaryFile,
  FrcsTripSummary,
} from '@speleotica/frcsdata'
import {
  CompassDatFile,
  CompassTrip,
  LrudItem,
  DistanceUnit,
  AzimuthUnit,
  InclinationUnit,
  FrontsightItem,
  BacksightItem,
  LrudAssociation,
} from '@speleotica/compass/dat'
import { Angle, Unit, Length } from '@speleotica/unitized'

function convertDistanceUnit(unit: Unit<Length>): DistanceUnit {
  switch (unit) {
    case Length.inches:
      return DistanceUnit.FeetAndInches
    case Length.feet:
      return DistanceUnit.DecimalFeet
    default:
      return DistanceUnit.Meters
  }
}

function convertAzimuthUnit(unit: Unit<Angle>): AzimuthUnit {
  switch (unit) {
    case Angle.gradians:
      return AzimuthUnit.Gradians
    default:
      return AzimuthUnit.Degrees
  }
}

function convertInclinationUnit(unit: Unit<Angle>): InclinationUnit {
  switch (unit) {
    case Angle.gradians:
      return InclinationUnit.Gradians
    default:
      return InclinationUnit.Degrees
  }
}

export default function convertToDat({
  survey,
  summaries,
}: {
  survey: FrcsSurveyFile
  summaries?: FrcsTripSummaryFile
}): CompassDatFile {
  return {
    trips: survey.trips.map(
      (
        {
          header: {
            name,
            date,
            team,
            distanceUnit,
            azimuthUnit,
            inclinationUnit,
            backsightAzimuthCorrected,
            backsightInclinationCorrected,
            hasBacksightAzimuth,
            hasBacksightInclination,
          },
          shots,
        }: FrcsTrip,
        index: number
      ): CompassTrip => {
        const summary: FrcsTripSummary | undefined = summaries
          ? summaries.tripSummaries[index]
          : undefined
        return {
          header: {
            cave: survey.cave || '',
            name: String(index + 1),
            date: summary ? summary.date : date || new Date(0, 0, 1),
            comment: summary ? summary.name : name,
            team: summary
              ? summary.team.join(';')
              : team
              ? team.join(';')
              : null,
            declination: Angle.degrees(0),
            distanceUnit: convertDistanceUnit(distanceUnit),
            azimuthUnit: convertAzimuthUnit(azimuthUnit),
            inclinationUnit: convertInclinationUnit(inclinationUnit),
            lrudUnit: convertDistanceUnit(distanceUnit),
            lrudOrder: [
              LrudItem.Left,
              LrudItem.Right,
              LrudItem.Up,
              LrudItem.Down,
            ],
            frontsightOrder: [
              FrontsightItem.Distance,
              FrontsightItem.Azimuth,
              FrontsightItem.Inclination,
            ],
            backsightOrder:
              hasBacksightAzimuth || hasBacksightInclination
                ? [BacksightItem.Azimuth, BacksightItem.Inclination]
                : null,
            hasRedundantBacksights: Boolean(
              hasBacksightAzimuth || hasBacksightInclination
            ),
            lrudAssociation: LrudAssociation.ToStation,
          },
          shots: shots.map(
            ({
              from,
              to,
              distance,
              frontsightAzimuth,
              frontsightInclination,
              backsightAzimuth,
              backsightInclination,
              left,
              right,
              up,
              down,
              excludeDistance,
              comment,
            }) => ({
              from: to ? from : `${from}LRUD`,
              to: to ? to : from,
              distance,
              frontsightAzimuth,
              frontsightInclination,
              backsightAzimuth:
                backsightAzimuth && backsightAzimuthCorrected
                  ? Angle.opposite(backsightAzimuth)
                  : backsightAzimuth,
              backsightInclination:
                backsightInclination && backsightInclinationCorrected
                  ? backsightInclination.negate()
                  : backsightInclination,
              left,
              right,
              up,
              down,
              excludeDistance,
              comment,
            })
          ),
        }
      }
    ),
  }
}
