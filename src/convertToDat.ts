import {
  FrcsSurveyFile,
  FrcsShot,
  FrcsTrip,
  FrcsTripSummaryFile,
  FrcsTripSummary,
} from '@speleotica/frcsdata'
import {
  CompassDatFile,
  CompassTrip,
  CompassShot,
  LrudItem,
  DistanceUnit,
  AzimuthUnit,
  InclinationUnit,
  FrontsightItem,
  BacksightItem,
  LrudAssociation,
} from '@speleotica/compass/dat'
import {
  Angle,
  Unit,
  Length,
  Unitize,
  UnitizedNumber,
} from '@speleotica/unitized'

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

function isVertical(
  inc1: UnitizedNumber<Angle> | null | undefined,
  inc2: UnitizedNumber<Angle> | null | undefined
): boolean {
  return (
    inc1 != null &&
    Math.abs(90 - Math.abs(inc1.get(Angle.degrees))) < 1e-6 &&
    (inc2 == null || inc2.get(inc1.unit) === inc1.get(inc1.unit))
  )
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

        function* convertShot(shot: FrcsShot): Iterable<CompassShot> {
          const { from, to, excludeDistance, comment } = shot
          let {
            distance,
            frontsightAzimuth,
            frontsightInclination,
            backsightAzimuth,
            backsightInclination,
          } = shot
          const { fromLruds, toLruds } = shot
          if (backsightAzimuth && backsightAzimuthCorrected)
            backsightAzimuth = Angle.opposite(backsightAzimuth)
          if (backsightInclination && backsightInclinationCorrected)
            backsightInclination = backsightInclination.negate()
          if (!frontsightInclination && !backsightInclination) {
            frontsightInclination = Unitize.degrees(0)
          }
          if (
            !distance ||
            distance.isZero ||
            isVertical(frontsightInclination, backsightInclination?.negate()) ||
            isVertical(backsightInclination?.negate(), frontsightInclination)
          ) {
            if (!frontsightAzimuth && !backsightAzimuth) {
              frontsightAzimuth = Unitize.degrees(0)
            }
          }
          if (distance == null) distance = new UnitizedNumber(0, distanceUnit)
          if (fromLruds) {
            const { left, right, up, down } = fromLruds
            yield {
              from: `${from}LRUD`,
              to: from,
              distance: new UnitizedNumber(0, distanceUnit),
              left,
              right,
              up,
              down,
            }
          }
          if (!to) return
          let { left, right, up, down } = toLruds || {}
          if (left == null) left = new UnitizedNumber(0, distanceUnit)
          if (right == null) right = new UnitizedNumber(0, distanceUnit)
          if (up == null) up = new UnitizedNumber(0, distanceUnit)
          if (down == null) down = new UnitizedNumber(0, distanceUnit)
          yield {
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
          }
        }

        const convertedShots = []
        for (const shot of shots) {
          for (const converted of convertShot(shot))
            convertedShots.push(converted)
        }

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
            declination: Unitize.degrees(0),
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
          shots: convertedShots,
        }
      }
    ),
  }
}
